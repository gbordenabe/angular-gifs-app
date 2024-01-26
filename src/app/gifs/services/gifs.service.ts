import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchReponse } from '../interfaces/gifs.interfaces';
import { environment } from '../../../environments/environment.development';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList:Gif[] = []

  private _tagsHistory: string[] = []
  private apiKey:string = environment.API_KEY
  private serviceUrl:string = 'http://api.giphy.com/v1/gifs'

  constructor(
    private http: HttpClient
  ) {
    this.loadLocalStorage()
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory]
  }

  private organizeTagsHistory(tag:string): void{
    tag = tag.trim().toLowerCase()
    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag)
    }
    this._tagsHistory.unshift(tag)
    this._tagsHistory.slice(0,10)

    this.saveLocalStorage()
  }

  private saveLocalStorage(): void{
    localStorage.setItem('tagsHistory', JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage(): void{
    if(localStorage.getItem('tagsHistory')){
      this._tagsHistory = JSON.parse(localStorage.getItem('tagsHistory')!)
    }
    if(this._tagsHistory.length > 0){
      this.searchTag(this._tagsHistory[0])
    }
  }

  searchTag(tag: string): void{
    if(tag.trim().length === 0) return
    this.organizeTagsHistory(tag)

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('q', tag)
      .set('limit', '10')

    this.http.get<SearchReponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((response) => {
        this.gifList = response.data
      })


  }
}
