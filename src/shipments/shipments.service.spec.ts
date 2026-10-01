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

  it("returns all shipments", async () => {
    //Arrange
    const shipmentsMock = [
      { id: 1, trackingCode: "SHIP-001", destination: "Cali", status: ShipmentStatus.CREATED },
      { id: 2, trackingCode: "SHIP-002", destination: "Bogota", status: ShipmentStatus.DISPATCHED },
    ] as ShipmentEntity[];

    repositoryMock.find.mockResolvedValue(shipmentsMock);
    
    // Act
    const result = await service.findAll();

    //Assert
    expect(result).toEqual(shipmentsMock);
    expect(repositoryMock.find).toHaveBeenCalledTimes(1);
  });

    it("returns a shipment when the id exists", async () => {
    const shipmentMock = {
      id: 7,
      trackingCode: "SHIP-007",
      destination: "Cali",
      status: ShipmentStatus.CREATED,
    } as ShipmentEntity;

    repositoryMock.findOneBy.mockResolvedValue(shipmentMock);

    const result = await service.findOne(7);

    expect(result).toEqual(shipmentMock);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 7 });
  });
    it("throws NotFoundException when the id does not exist", async () => {
    repositoryMock.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

    it("creates and saves a shipment", async () => {
    //Arrange
    const data = {
      trackingCode: "SHIP-100",
      destination: "Cali",
    };

    const createdShipment = {
      ...data,
      status: ShipmentStatus.CREATED,
    } as ShipmentEntity;

    const savedShipment = {
      ...createdShipment,
      id: 1,
    } as ShipmentEntity;

    repositoryMock.create.mockReturnValue(createdShipment);
    repositoryMock.save.mockResolvedValue(savedShipment);

    
    const result = await service.create(data);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      ...data,
      status: ShipmentStatus.CREATED,
    });
    expect(repositoryMock.save).toHaveBeenCalledWith(createdShipment);
    expect(result).toEqual(savedShipment);
  });

});


