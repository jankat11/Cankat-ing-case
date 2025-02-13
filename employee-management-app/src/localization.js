const translations = {
    en: { title: "Employee Management", add: "Add Employee", edit: "Edit Employee" },
    tr: { title: "Çalışan Yönetimi", add: "Çalışan Ekle", edit: "Çalışanı Düzenle" }
  };
  
  export const translate = (key, lang = 'en') => translations[lang][key] || key;
  