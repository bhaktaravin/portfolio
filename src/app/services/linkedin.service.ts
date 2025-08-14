import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface LinkedInRecommendation {
  recommender: LinkedInProfile;
  text: string;
  type: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class LinkedInService {
  private clientId: string = '';
  private clientSecret: string = '';
  private redirectUri: string = 'http://localhost:4200/';
  private scope: string = 'r_liteprofile r_emailaddress';
  private accessToken: string = '';

  constructor(private http: HttpClient) {
    this.loadCredentials();
  }

  private async loadCredentials(): Promise<void> {
    try {
      // In a real app, you'd load these from environment variables or a secure config
      // For now, we'll read from the credentials file
      const response = await fetch('/assets/.linkedIn_Credentials');
      const text = await response.text();
      const lines = text.trim().split('\n');
      this.clientId = lines[0].trim();
      this.clientSecret = lines[1].trim();
    } catch (error) {
      console.error('Failed to load LinkedIn credentials:', error);
    }
  }

  /**
   * Initiates LinkedIn OAuth flow
   */
  authenticate(): void {
    console.log('LinkedIn Client ID:', this.clientId);
    console.log('LinkedIn Redirect URI:', this.redirectUri);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${encodeURIComponent(this.scope)}`;

    console.log('LinkedIn Auth URL:', authUrl);
    window.location.href = authUrl;
  }

  /**
   * Exchanges authorization code for access token
   */
  exchangeCodeForToken(code: string): Observable<any> {
    const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri
    });

    return this.http.post(tokenUrl, body.toString(), { headers }).pipe(
      map((response: any) => {
        this.accessToken = response.access_token;
        localStorage.setItem('linkedin_access_token', this.accessToken);
        return response;
      }),
      catchError(error => {
        console.error('Error exchanging code for token:', error);
        return of(null);
      })
    );
  }

  /**
   * Gets the stored access token
   */
  getStoredToken(): string {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('linkedin_access_token') || '';
    }
    return this.accessToken;
  }

  /**
   * Fetches user profile information
   */
  getUserProfile(): Observable<LinkedInProfile> {
    const token = this.getStoredToken();
    if (!token) {
      return of({} as LinkedInProfile);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>('https://api.linkedin.com/v2/people/~', { headers }).pipe(
      map(response => ({
        id: response.id,
        firstName: response.firstName?.localized?.en_US || '',
        lastName: response.lastName?.localized?.en_US || '',
        profilePicture: response.profilePicture?.displayImage || ''
      })),
      catchError(error => {
        console.error('Error fetching LinkedIn profile:', error);
        return of({} as LinkedInProfile);
      })
    );
  }

  /**
   * Note: LinkedIn's API has limitations for recommendations
   * The current LinkedIn API doesn't provide direct access to recommendations
   * This is a placeholder for when/if LinkedIn provides this capability
   */
  getRecommendations(): Observable<LinkedInRecommendation[]> {
    console.warn('LinkedIn API does not currently provide direct access to recommendations.');
    console.warn('You will need to manually copy recommendations from your LinkedIn profile.');

    // Return empty array since LinkedIn doesn't provide this endpoint
    return of([]);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  /**
   * Clear authentication
   */
  logout(): void {
    this.accessToken = '';
    localStorage.removeItem('linkedin_access_token');
  }

  /**
   * Helper function to format manual recommendations
   */
  createRecommendationFromManualInput(
    recommenderName: string,
    recommenderTitle: string,
    recommenderCompany: string,
    recommendationText: string,
    linkedinUrl: string,
    relationship: string,
    date: string
  ): any {
    return {
      name: recommenderName,
      position: recommenderTitle,
      company: recommenderCompany,
      content: recommendationText,
      linkedinUrl: linkedinUrl,
      relationship: relationship,
      date: date,
      isLinkedInRecommendation: true
    };
  }
}
