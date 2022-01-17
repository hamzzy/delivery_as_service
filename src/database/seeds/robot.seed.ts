import { Robot } from '../../entities/robot.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { RobotLocationHistory } from '../../entities/robotMovement.entity';

export default class CreateRobot implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(Robot)().createMany(6);
    await factory(Robot)().createMany(6);

    await factory(RobotLocationHistory)().createMany(20);


  }
}
