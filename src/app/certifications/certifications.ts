import { Component } from '@angular/core';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.html',
  styleUrls: ['./certifications.css']
})




export class CertificationsComponent {
  certifications = [
    {
      title: 'Introduction to Scrum Master Profession',
      issuer: 'IBM',
      date: 'Sep 2025',
      credentialId: 'TA7GK09XYXMS',
      credentialUrl: ''
    },
    {
      title: 'Machine Learning Specialization',
      issuer: 'DeepLearning.AI, Stanford University',
      date: 'Sep 2025',
      credentialId: 'N4TFEZM0AEIQ',
      credentialUrl: ''
    },
    {
      title: 'Unsupervised Learning, Recommenders, Reinforcement Learning',
      issuer: 'Stanford University',
      date: 'Sep 2025',
      credentialId: 'OEB2D648FQAT',
      credentialUrl: ''
    },
    {
      title: 'Advanced Learning Algorithms',
      issuer: 'DeepLearning.AI, Stanford University',
      date: 'Aug 2025',
      credentialId: 'V72APAFWZ376',
      credentialUrl: ''
    },
    {
      title: 'Introduction to Cybersecurity Careers',
      issuer: 'IBM',
      date: 'Aug 2025',
      credentialId: '4ZZO6LCO4RNJ',
      credentialUrl: ''
    },
    {
      title:'Introduction to Cybersecurity Careers',
      issuer: 'IBM',
      date: 'Aug 2025',
      credentialId: '4ZZO6LCO4RNJ',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/4Z2O6LCO4RNJ'
    },
    {
      title:'Supervised Machine Learning: Regression and Classification',
      issuer: 'Stanford University',
      date: 'Jul 2025',
      credentialId: 'IR03C6YJGOOK',
      credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/IR03C6YJGOOK'
    }
  ];

}
