// Builds the resume from portfolio.data.ts on demand. pdfmake and docx are
// large, so they're imported dynamically and only load when someone downloads.
import {
  PROFILE,
  RESUME_SKILL_CATEGORIES,
  experiencesToResume,
  educationToResume,
  certificationsToResume,
} from './data/portfolio.data';

export async function generateResume(type: 'pdf' | 'docx'): Promise<void> {
  const workExperience = experiencesToResume();
  const education = educationToResume();
  const certifications = certificationsToResume();
  const skillCategories = RESUME_SKILL_CATEGORIES;

  if (type === 'pdf') {
    const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    pdfMake.addVirtualFileSystem(pdfFonts);
    const docDefinition = {
      content: [
        { text: PROFILE.fullName, style: 'header' },
        { text: PROFILE.jobTitle, style: 'subheader', margin: [0, 0, 0, 10] },
        { text: PROFILE.aboutDescription, margin: [0, 0, 0, 15] },
        { text: 'Email: ' + PROFILE.email },
        { text: 'Phone: ' + PROFILE.phone },
        { text: 'Location: ' + PROFILE.location, margin: [0, 0, 0, 15] },
        { text: 'Skills', style: 'sectionHeader' },
        ...skillCategories.map((cat) => ({
          text: `${cat.name}: ${cat.skills.join(', ')}`,
          margin: [0, 0, 0, 5],
        })),
        { text: '', margin: [0, 0, 0, 10] },
        { text: 'Experience', style: 'sectionHeader' },
        ...workExperience.flatMap((exp) => [
          { text: `${exp.title} – ${exp.company}`, bold: true },
          { text: exp.period, italics: true, margin: [0, 0, 0, 2] },
          { text: exp.description, margin: [0, 0, 0, 8] },
        ]),
        { text: 'Education', style: 'sectionHeader' },
        ...education.flatMap((edu) => [
          { text: `${edu.degree}, ${edu.institution}`, bold: true },
          { text: `${edu.period} – ${edu.location}`, italics: true, margin: [0, 0, 0, 8] },
        ]),
        { text: 'Certifications', style: 'sectionHeader' },
        ...certifications.map((cert) => ({
          text: `${cert.name} (${cert.issuer}, ${cert.year})`,
          margin: [0, 0, 0, 3],
        })),
      ],
      styles: {
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 14, bold: true },
        sectionHeader: { fontSize: 13, bold: true, color: '#003366', margin: [0, 10, 0, 4] },
      },
    };
    pdfMake.createPdf(docDefinition).download(`${PROFILE.fullName}-Resume.pdf`);
  } else {
    const { Document, Packer, Paragraph, TextRun } = await import('docx');
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ children: [new TextRun({ text: PROFILE.fullName, bold: true, size: 32 })] }),
          new Paragraph({ children: [new TextRun({ text: PROFILE.jobTitle, italics: true, size: 24 })] }),
          new Paragraph(PROFILE.aboutDescription),
          new Paragraph(''),
          new Paragraph('Email: ' + PROFILE.email),
          new Paragraph('Phone: ' + PROFILE.phone),
          new Paragraph('Location: ' + PROFILE.location),
          new Paragraph(''),
          new Paragraph({ children: [new TextRun({ text: 'Skills', bold: true, size: 26 })] }),
          ...skillCategories.map((cat) => new Paragraph(`${cat.name}: ${cat.skills.join(', ')}`)),
          new Paragraph(''),
          new Paragraph({ children: [new TextRun({ text: 'Experience', bold: true, size: 26 })] }),
          ...workExperience.flatMap((exp) => [
            new Paragraph({ children: [new TextRun({ text: `${exp.title} – ${exp.company}`, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: exp.period, italics: true })] }),
            new Paragraph(exp.description),
            new Paragraph(''),
          ]),
          new Paragraph({ children: [new TextRun({ text: 'Education', bold: true, size: 26 })] }),
          ...education.flatMap((edu) => [
            new Paragraph({ children: [new TextRun({ text: `${edu.degree}, ${edu.institution}`, bold: true })] }),
            new Paragraph({ children: [new TextRun({ text: `${edu.period} – ${edu.location}`, italics: true })] }),
            new Paragraph(''),
          ]),
          new Paragraph({ children: [new TextRun({ text: 'Certifications', bold: true, size: 26 })] }),
          ...certifications.map((cert) => new Paragraph(`${cert.name} (${cert.issuer}, ${cert.year})`)),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${PROFILE.fullName}-Resume.docx`;
    a.click();
    globalThis.URL.revokeObjectURL(url);
  }
}
