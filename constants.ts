import { CVData, SectionType } from './types';

export const INITIAL_DATA: CVData = {
  template: 'modern',
  themeColor: '#2563eb', // Blue-600
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  sections: [
    {
      id: 'sec_exp',
      type: SectionType.EXPERIENCE,
      title: 'İş Deneyimi',
      items: [
        { id: '1', title: 'Örnek Şirket A.Ş.', subtitle: 'Kıdemli Yazılımcı', date: '2020 - Günümüz', description: '• Büyük ölçekli React uygulamaları geliştirdim.\n• Ekip liderliği yaptım ve code review süreçlerini yönettim.' }
      ]
    },
    {
      id: 'sec_edu',
      type: SectionType.EDUCATION,
      title: 'Eğitim',
      items: [
         { id: '2', title: 'Teknik Üniversitesi', subtitle: 'Bilgisayar Mühendisliği', date: '2016 - 2020', description: '3.85 GPA ile mezun oldum.' }
      ]
    },
    {
      id: 'sec_skills',
      type: SectionType.SKILLS,
      title: 'Yetenekler',
      items: [
        { id: '3', title: 'JavaScript' },
        { id: '4', title: 'React' },
        { id: '5', title: 'TypeScript' },
        { id: '6', title: 'Node.js' }
      ]
    }
  ]
};