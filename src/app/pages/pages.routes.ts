import { Route, Routes } from "@angular/router";
import { ProductsComponent } from "./products/products.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PagesComponent } from "./pages.component";
import { LogisticsComponent } from "./logistics/logistics.component";

export const pagesRoutes: Routes = [
    {
        path: 'pages',
        component: PagesComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'products',
                component: ProductsComponent
            },
            {
                path: 'logistics',
                component: LogisticsComponent
            }

        ]
    },
]
    
