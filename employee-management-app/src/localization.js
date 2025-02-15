const translations = {
  en: {
    employees: "Employees",
    addNew: "Add New",
    edit: "Edit Employee",
    employeeList: "Employee List",
    firstName: "First Name",
    lastName:"Last Name",
    dateOfEmployement:"Date of Employment",
    dateOfBirth:"Date of Birth",
    phone:"Phone",
    email:"Email",
    department:"Department",
    position:"Position",
    actions: "Actions",
    search: "Search by first or last name",
    save: "Save"
  },
  tr: {
    employees: "Çalışanlar",
    addNew: "Çalışan Ekle",
    edit: "Çalışanı Düzenle",
    employeeList: "Çalışan Listesi",
    firstName: "Ad",
    lastName: "Soyad",
    dateOfEmployement: "İşe Başlama Tarihi",
    dateOfBirth: "Doğum Tarihi",
    phone: "Telefon",
    email: "E-posta",
    department: "Departman",
    position: "Pozisyon",
    actions: "İşlemler",
    search: "Ad veya soyad arayın",
    save: "Kaydet"
  },
};

export const translate = (key, lang = "en") => translations[lang][key] || key;
