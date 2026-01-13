import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct fullName', () => {
    expect(component.fullName).toBe('Ravin Bhakta');
  });

  it('should return correct initials', () => {
    expect(component.initials).toBe('RB');
  });

  it('should have a resume link', () => {
    expect(component.resumeLink).toBe('assets/ravinbhaktaresume.pdf');
  });

  it('should have stats array with correct length', () => {
    expect(component.stats.length).toBe(4);
  });

  it('should have correct jobTitle', () => {
    expect(component.jobTitle).toContain('Software Engineer');
  });

  it('should have correct aboutDescription', () => {
    expect(component.aboutDescription).toContain('Skilled Software Engineer');
  });
});
