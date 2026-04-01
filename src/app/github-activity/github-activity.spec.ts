import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GitHubActivityComponent } from './github-activity';

describe('GitHubActivityComponent', () => {
  let component: GitHubActivityComponent;
  let fixture: ComponentFixture<GitHubActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GitHubActivityComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GitHubActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate contribution grid', () => {
    expect(component.contributionGrid.length).toBe(12);
    expect(component.contributionGrid[0].length).toBe(7);
  });

  it('should calculate time ago correctly', () => {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const timeAgo = component.getTimeAgo(oneDayAgo);
    expect(timeAgo).toContain('d ago');
  });
});
