import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

export interface IDatabaseItem {
    name: string;
    val: string;
}

@Injectable({
    providedIn: 'root'
})

export class FirebaseService {

    listFeed: Observable<any[]>;
    objFeed: Observable<any>;

    constructor(public db: AngularFireDatabase) {

    }

    connectToDatabase() {
        this.listFeed = this.db.list('list').valueChanges();
        this.objFeed = this.db.object('obj').valueChanges();
    }

    getChangeFeedList() {
        return this.listFeed;
    }

    getChangeFeedObject() {
        return this.objFeed;
    }

    removeListItems() {
        this.db.list('list').remove();
    }

    addSimpleListObject(val: string) {
        let item: IDatabaseItem = {
            name: "test",
            val: val
        };
        this.db.list('list').push(item);
    }

    updateObject(val: string) {
        let item: IDatabaseItem = {
            name: "test",
            val: val
        };
        this.db.object('obj').set([item]);
    }

    updateUserPosition(position: { latitude: number; longitude: number }) {
        // Actualizăm poziția centrală a utilizatorului în Firebase
        this.db.object('userPosition').set(position);
    }

    getUserPosition() {
        // Obținem poziția centrală a utilizatorului din Firebase
        return this.db.object('userPosition').valueChanges();
    }

    addListObject(data: { latitude: number; longitude: number } | string) {
        if (typeof data === 'string') {
            // Adaugă string-ul într-o listă separată pentru string-uri
            this.db.list('nameList').push(data);
        } else {
            // Adaugă obiectul locație în lista de puncte geografice
            this.db.list('mapPoints').push(data);
        }
    }

    getMapPoints() {
        // Obținem lista de puncte din Firebase
        return this.db.list('mapPoints').valueChanges();
    }
}
