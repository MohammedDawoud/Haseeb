import { TestBed } from '@angular/core/testing';

import { OfficialDocumentsService } from './official-documents.service';

describe('OfficialDocumentsService', () => {
  let service: OfficialDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficialDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
