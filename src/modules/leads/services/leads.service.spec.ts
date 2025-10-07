import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { DatabaseService } from 'src/common/database/database.service';

const mockDatabaseService = {
  getDb: jest.fn(() => ({
    prepare: jest.fn(() => ({
      all: jest.fn((params) => [{ lead: 'data', params }]),
    })),
  })),
};

describe('LeadsService', () => {
  let service: LeadsService;
  let dbService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should contain owner_id for rep user', async () => {
      const repUser = { userId: 'rep123', role: 'rep' };
      const mockPrepare = jest.fn(() => ({ all: jest.fn() }));
      jest
        .spyOn(dbService, 'getDb')
        .mockReturnValueOnce({ prepare: mockPrepare } as any);
      await service.findAll(repUser, {});
      expect(mockPrepare).toHaveBeenCalledWith(
        expect.stringContaining('owner_id = ?'),
      );
    });

    it('should not contain owner_id for manager user', async () => {
      const managerUser = { userId: 'manager123', role: 'manager' };
      const mockPrepare = jest.fn(() => ({ all: jest.fn() }));
      jest
        .spyOn(dbService, 'getDb')
        .mockReturnValueOnce({ prepare: mockPrepare } as any);
      await service.findAll(managerUser, {});
      expect(mockPrepare).not.toHaveBeenCalledWith(
        expect.stringContaining('owner_id = ?'),
      );
    });
  });
});
