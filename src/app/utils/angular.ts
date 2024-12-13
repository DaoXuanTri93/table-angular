import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import type { Observable } from 'rxjs';

@Injectable()
export class TFunction extends TranslateService {
  prefix = '';

  public override get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return super.get(this.prefix + '.' + key, interpolateParams);
  }

  public override instant(key: string | Array<string>, interpolateParams?: Object): string {
    return super.instant(this.prefix + '.' + key, interpolateParams);
  }
}
