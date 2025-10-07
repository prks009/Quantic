import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { DatabaseService } from 'src/common/database/database.service';
import { AccountsService } from 'src/modules/accounts/services/accounts.service';
import { UpdatesGateway } from 'src/common/updates/updates.gateway';

describe('ActivitiesService', () => {
  let service: ActivitiesService;

  const mockDatabaseService = {
    getDb: jest.fn(),
  };
  const mockAccountsService = {
    findOne: jest.fn(),
  };
  const mockUpdatesGateway = {
    broadcastActivityUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: AccountsService,
          useValue: mockAccountsService,
        },
        {
          provide: UpdatesGateway,
          useValue: mockUpdatesGateway,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
