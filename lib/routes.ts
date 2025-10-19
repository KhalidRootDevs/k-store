export const routes = {
  publicRoutes: {
    home: "/",
    contactUs: "/contact-us",
    adminLogin: "/admin/login",
  },
  privateRoutes: {
    checkout: "/checkout",
    admin: {
      dashboard: "/admin/dashboard",
      category: {
        home: `/admin/categories`,
        create: `/admin/categories/new`,
        edit: (id: number | string) => `/root/retailer/branch/${id}/update`,
      },
      settings: `/admin/settings`,
    },
  },
};
