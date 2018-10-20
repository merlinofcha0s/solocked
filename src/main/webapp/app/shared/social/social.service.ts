import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class SocialService {
    private resourceUrl = SERVER_API_URL + 'api/';

    constructor(private http: HttpClient) {}

    getLatestTweet(): Observable<any> {
        return this.http.get(this.resourceUrl + 'get-latest-tweet');
    }
}
