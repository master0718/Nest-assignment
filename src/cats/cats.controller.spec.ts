import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Cat } from './cat.entity';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a cat', async () => {
      const createCatDto: CreateCatDto = { name: 'Test Cat', age: 4, breed: 'Test Breed' };
      jest.spyOn(service, 'create').mockImplementation(async () => new Cat());

      await controller.create(createCatDto);
      expect(service.create).toHaveBeenCalledWith(createCatDto);
    });
  });

  describe('findAll()', () => {
    it('should return an array of cats', async () => {
      const result: Cat[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne()', () => {
    it('should retrieve a single cat by ID', async () => {
      const cat = new Cat();
      jest.spyOn(service, 'findOne').mockResolvedValue(cat);

      expect(await controller.findOne(1)).toBe(cat);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update()', () => {
    it('should update a cat', async () => {
      const updateCatDto: UpdateCatDto = { name: 'Updated Name', age: 5 };
      jest.spyOn(service, 'update').mockImplementation(async () => new Cat());

      await controller.update(1, updateCatDto);
      expect(service.update).toHaveBeenCalledWith(1, updateCatDto);
    });
  });

  describe('remove()', () => {
    it('should remove a cat', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});