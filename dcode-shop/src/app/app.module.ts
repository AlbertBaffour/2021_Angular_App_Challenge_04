import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RecommendeditemComponent } from './recommendeditem/recommendeditem.component';
import { NavigationComponent } from './navigation/navigation.component';
import {ShopModule} from "./shop/shop.module";
import {SharedModule} from "./shared/shared.module";
import {AdminModule} from "./admin/admin.module";
import {SuperadminModule} from "./superadmin/superadmin.module";
import { SecurityModule } from './security/security.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ArticleModule} from "./shop/article/article.module";
import { NavigationMobileComponent } from './navigation-mobile/navigation-mobile.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileFormComponent } from './user-profile/user-profile-form/user-profile-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RecommendeditemComponent,
    NavigationComponent,
    FooterComponent,
    PageNotFoundComponent,
    NavigationMobileComponent,
    UserProfileComponent,
    UserProfileFormComponent,
  ],
    imports: [
        SharedModule,
        ShopModule,
        AdminModule,
        SuperadminModule,
        SecurityModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
      ArticleModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
