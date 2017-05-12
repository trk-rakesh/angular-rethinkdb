import {Injectable, Optional} from '@angular/core';
import {Http} from '@angular/http';
import {AngularRethinkDBObservable} from './RethinkDBObservable';
import {IRethinkFilter, IRethinkDBAPIConfig} from './interfaces';

export class RethinkDBAPIConfig implements IRethinkDBAPIConfig {
    database: string
    host?: string 
    port?: number
}

@Injectable()
export class AngularRethinkDBService {
    
    private r: {db: string, table: string, r: Object}[] = [];
    private http$: Http;
    private config: RethinkDBAPIConfig;

    constructor( @Optional() config: RethinkDBAPIConfig, http$: Http ) {
        this.config = config;
        this.http$ = http$;
    }
    
    list(table: string, filter?: IRethinkFilter): AngularRethinkDBObservable<any[]> {
        
        let _r = this.r.filter(r => r.db === this.config.database && r.table === table)
        if (_r.length === 0) { 
                       
            let r = new AngularRethinkDBObservable<any[]>(this.config, this.http$, table, filter);
            this.r.push({
                db: this.config.database,
                table: table,
                r: r
            });
            return r;
            
        } else
            return _r.pop().r as AngularRethinkDBObservable<any[]>;
    }
}