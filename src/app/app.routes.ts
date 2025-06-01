import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImageGenComponent } from './image-gen/image-gen.component';
import { ContentCreatorComponent } from './content-creator/content-creator.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent,
    },
    {
        path: 'home', component: HomeComponent
    },
    {
        path: 'imagegen', component: ImageGenComponent
    },
    {
        path: 'smartgen', component: ContentCreatorComponent
    },
    {
        path: '**', component: HomeComponent
    }
];
