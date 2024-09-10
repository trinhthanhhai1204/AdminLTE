import { Routes } from '@angular/router';
import {BooksComponent} from "./pages/books/books/books.component";
import {CategoriesComponent} from "./pages/categories/categories/categories.component";
import {CustomersComponent} from "./pages/customers/customers/customers.component";
import {OrdersComponent} from "./pages/orders/orders/orders.component";
import {OrderDetailsComponent} from "./pages/order-details/order-details/order-details.component";
import {OrdersByCustomerComponent} from "./pages/orders-by-customer/orders-by-customer/orders-by-customer.component";
import {EditBookComponent} from "./pages/books/edit-book/edit-book.component";
import {BookDetailsComponent} from "./pages/books/book-details/book-details.component";
import {AddBookComponent} from "./pages/books/add-book/add-book.component";
import {AddOptionComponent} from "./pages/options/add-option/add-option.component";
import {EditOptionComponent} from "./pages/options/edit-option/edit-option.component";
import {AddCategoryComponent} from "./pages/categories/add-category/add-category.component";
import {EditCategoryComponent} from "./pages/categories/edit-category/edit-category.component";
import {AddCustomerComponent} from "./pages/customers/add-customer/add-customer.component";
import {UpdateUserComponent} from "./pages/customers/edit-customer/update-user.component";
import {CustomerDetailsComponent} from "./pages/customers/customer-details/customer-details/customer-details.component";
import {MainComponent} from "./components/main/main.component";
import {tokenChildGuard} from "./guard/token-child.guard";
import {authChildGuard} from "./guard/auth-child.guard";
import {LoginComponent} from "./pages/login/login/login.component";
import {OwnersComponent} from "./pages/owners/owners/owners.component";
import {StaffsComponent} from "./pages/staffs/staffs/staffs.component";
import {AddStaffComponent} from "./pages/staffs/add-staff/add-staff.component";
import {DashboardComponent} from "./pages/dashboard/dashboard/dashboard.component";
import {ownerGuard} from "./guard/owner.guard";
import {PageNotFoundComponent} from "./pages/page-not-found/page-not-found/page-not-found.component";
import {
  RedirectToPageNotFoundComponent
} from "./pages/redirects/redirect-to-page-not-found/redirect-to-page-not-found.component";
import {ChartComponent} from "./pages/chart/chart/chart.component";
import {ChartAllTimeComponent} from "./pages/chart/chart-all-time/chart-all-time/chart-all-time.component";
import {ChartYearComponent} from "./pages/chart/chart-year/chart-year/chart-year.component";
import {ChartMonthlyComponent} from "./pages/chart/chart-monthly/chart-monthly/chart-monthly.component";
import {ChartWeekComponent} from "./pages/chart/chart-week/chart-week/chart-week.component";
import {ChartTodayComponent} from "./pages/chart/chart-today/chart-today/chart-today.component";
import {ownerChildGuard} from "./guard/owner-child.guard";
import {UserComponent} from "./pages/user/user/user.component";
import {StatisticalComponent} from "./pages/statistical/statistical/statistical.component";
import {OutOfStockComponent} from "./pages/statistical/out-of-stock/out-of-stock/out-of-stock.component";
import {RevenueByDateComponent} from "./pages/statistical/revenue-by-date/revenue-by-date.component";
import {RevenueByMonthComponent} from "./pages/statistical/revenue-by-month/revenue-by-month.component";
import {RevenueByYearComponent} from "./pages/statistical/revenue-by-year/revenue-by-year.component";
import {RevenueAllTimeComponent} from "./pages/statistical/revenue-all-time/revenue-all-time.component";
import {RevenueByProvinceComponent} from "./pages/statistical/revenue-by-province/revenue-by-province.component";
import {RevenueByDistrictComponent} from "./pages/statistical/revenue-by-district/revenue-by-district.component";
import {RevenueByWardComponent} from "./pages/statistical/revenue-by-ward/revenue-by-ward.component";
import {
  ChartUserProvinceComponent
} from "./pages/chart/chart-user-province/chart-user-province/chart-user-province.component";
import {
  ChartUserDistrictComponent
} from "./pages/chart/chart-user-district/chart-user-district/chart-user-district.component";
import {ChartUserWardComponent} from "./pages/chart/chart-user-ward/chart-user-ward/chart-user-ward.component";
import {
  RevenueByCategoryComponent
} from "./pages/statistical/revenue-by-category/revenue-by-category/revenue-by-category.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    component: MainComponent,
    canActivate: [],
    canActivateChild: [tokenChildGuard, authChildGuard],
    children: [
      {
        path:"",
        component: DashboardComponent
      },
      {
        path:"books",
        component: BooksComponent
      },
      {
        path:"books/:id",
        component: BookDetailsComponent
      },
      {
        path:"add-book",
        component: AddBookComponent
      },
      {
        path:"edit-book/:id",
        component: EditBookComponent
      },
      {
        path:"add-option",
        component: AddOptionComponent
      },
      {
        path:"edit-option/:id",
        component: EditOptionComponent
      },
      {
        path:"categories",
        component: CategoriesComponent
      },
      {
        path:"add-category",
        component: AddCategoryComponent
      },
      {
        path:"edit-category/:id",
        component: EditCategoryComponent
      },
      {
        path:"user",
        component: UserComponent,
        children: [
          {
            path:"customers",
            component: CustomersComponent
          },
          {
            path:"customer-details/:id",
            component: CustomerDetailsComponent
          },
          {
            path:"add-customer",
            component: AddCustomerComponent
          },
          {
            path:"staffs",
            component: StaffsComponent
          },
          {
            path:"add-staff",
            component: AddStaffComponent,
            canActivate: [ownerGuard]
          },
          {
            path:"owners",
            component: OwnersComponent
          },
          {
            path:"update-user/:id",
            component: UpdateUserComponent
          },
          {
            path: "**",
            component: RedirectToPageNotFoundComponent
          }
        ]
      },
      {
        path:"orders",
        component: OrdersComponent
      },
      {
        path:"order-details/:id",
        component: OrderDetailsComponent
      },
      {
        path:"orders-by-customer/:id",
        component: OrdersByCustomerComponent
      },
      {
        path:"chart",
        component: ChartComponent,
        canActivateChild: [ownerChildGuard],
        children: [
          {
            path:"today",
            component: ChartTodayComponent
          },
          {
            path:"week",
            component: ChartWeekComponent
          },
          {
            path:"monthly",
            component: ChartMonthlyComponent
          },
          {
            path:"year",
            component: ChartYearComponent
          },
          {
            path:"all-time",
            component: ChartAllTimeComponent
          },
          {
            path:"province",
            component: ChartUserProvinceComponent
          },
          {
            path:"district",
            component: ChartUserDistrictComponent
          },
          {
            path:"ward",
            component: ChartUserWardComponent
          },
          {
            path:"category",
            component: RevenueByCategoryComponent,
          },
          {
            path: "**",
            component: RedirectToPageNotFoundComponent
          }
        ]
      },
      {
        path:"statistical",
        component: StatisticalComponent,
        canActivateChild: [ownerChildGuard],
        children: [
          {
            path:"out-of-stock",
            component: OutOfStockComponent,
          },
          {
            path:"revenues/date",
            component: RevenueByDateComponent,
          },
          {
            path:"revenues/monthly",
            component: RevenueByMonthComponent,
          },
          {
            path:"revenues/year",
            component: RevenueByYearComponent,
          },
          {
            path:"revenues/all-time",
            component: RevenueAllTimeComponent,
          },
          {
            path:"revenues/province",
            component: RevenueByProvinceComponent,
          },
          {
            path:"revenues/district/:id",
            component: RevenueByDistrictComponent,
          },
          {
            path:"revenues/ward/:id",
            component: RevenueByWardComponent,
          },
        ]
      },
      {
        path: "404",
        component: PageNotFoundComponent
      },
      {
        path: "**",
        component: RedirectToPageNotFoundComponent
      }
    ]
  },
];
