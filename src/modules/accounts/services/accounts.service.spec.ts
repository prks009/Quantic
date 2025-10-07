import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { DatabaseService } from 'src/common/database/database.service';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: DatabaseService,
          useValue: {
            getDb: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
