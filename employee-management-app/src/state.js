export const saveState = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  export const loadState = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };
  