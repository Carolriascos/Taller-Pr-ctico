import { describe, jest, beforeEach, it, expect } from "@jest/globals";
import { ShipmentsService } from "./shipments.service";
import { ShipmentEntity } from "./entities/shipment.entity";
import { ShipmentStatus } from "./shipment-status.enum";
import { Test } from "@nestjs/testing";
import { ShipmentRulesService } from "./shipment-rules.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { NotFoundException } from "@nestjs/common";


describe("ShipmentsServiceTest", () => {
  let service: ShipmentsService;

  const repositoryMock = {
    find: jest.fn<() => Promise<ShipmentEntity[]>>(),
    findOneBy: jest.fn<(options: any) => Promise<ShipmentEntity | null>>(),
    create: jest.fn<(data: any) => ShipmentEntity>(),
    save: jest.fn<(data: any) => Promise<ShipmentEntity>>(),
  };

  const shipmentRulesServiceMock = {
    ensureCanBeDispatched: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ShipmentsService,
        {
          provide: getRepositoryToken(ShipmentEntity),
          useValue: repositoryMock,
        },
        {
          provide: ShipmentRulesService,
          useValue: shipmentRulesServiceMock,
        },
      ],
    }).compile();

    service = moduleRef.get(ShipmentsService);
  });

  it("is defined", () => {
    //Assert
    expect(service).toBeDefined();
  });
});