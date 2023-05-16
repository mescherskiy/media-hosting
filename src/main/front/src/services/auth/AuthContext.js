// import { useState, useEffect } from 'react';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       // Проверяем, авторизован ли пользователь на сервере
//       const response = await fetch('/api/user');
//       if (response.ok) {
//         // Если пользователь авторизован, получаем данные о нем
//         const user = await response.json();
//         setUser(user);
//       } else {
//         // Если пользователь не авторизован, устанавливаем значение null
//         setUser(null);
//       }
//       setIsLoading(false);
//     };
//     fetchUser();
//   }, []);

//   return { user, isLoading };
// };