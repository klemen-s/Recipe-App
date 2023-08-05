import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  url = 'http://localhost:8080/graphql';

  constructor(private http: HttpClient) {}

  errorHandler(error: HttpErrorResponse) {
    let newError = new Error();

    console.log(error);

    if (error.status === 400) {
      newError.message = 'Image is missing!';
      return throwError(() => newError);
    } else if (error.status === 401) {
      newError.message = 'Not authenticated';
      return throwError(() => newError);
    } else {
      newError.message = 'Please fill out all of the inputs!';
      return throwError(() => newError);
    }
  }

  postRecipe(
    title: string,
    imageUrl: string,
    description: string,
    recipe: string,
    ingredients: [],
    numOfMin: number
  ): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    const graphqlQuery = {
      query: `
            mutation CreateRecipe($ingredients : [String!]!, $title : String!, $imageUrl : String!, $numOfMin : Int!, $description : String!, $recipe : String!) {
          createRecipe(recipeInputData: {title: $title, imageUrl: $imageUrl, description: $description, recipe: $recipe, numOfMin: $numOfMin, ingredients: $ingredients}) {
            title
            imageUrl
            description
            numOfMin
            recipe
            ingredients
          }
        }
       `,
      variables: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        recipe: recipe,
        ingredients: ingredients,
        numOfMin: numOfMin,
      },
    };

    return this.http
      .post(this.url, JSON.stringify(graphqlQuery), {
        headers: headers,
      })
      .pipe(catchError(this.errorHandler));
  }

  getRecipes(page: number): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    const graphqlQuery = {
      query: `
        query FetchRecipes($page : Int!) {getRecipes (page : $page) {recipes {title,imageUrl,numOfMin,_id}, totalItems}}
      `,
      variables: {
        page: page,
      },
    };

    return this.http.post<any>(this.url, JSON.stringify(graphqlQuery), {
      headers: headers,
    });
  }

  getRecipe(recipeId: string | null): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json');

    const graphqlQuery = {
      query: `
        query {
          getRecipe(recipeId: "${recipeId}") {
            title
            imageUrl
            numOfMin
            _id
            description
            recipe
            ingredients
            creator {
              name
            }
          }
        }
      `,
    };

    return this.http.post(this.url, JSON.stringify(graphqlQuery), {
      headers: headers,
    });
  }
  postImage(data: any): Observable<any> {
    return this.http
      .post('http://localhost:8080/post-image', data)
      .pipe(catchError(this.errorHandler));
  }
}
