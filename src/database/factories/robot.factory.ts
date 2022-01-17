import { Robot } from '../../entities/robot.entity';
import minifaker from 'minifaker';
import 'minifaker/dist/locales/en';
import { define, factory } from 'typeorm-seeding';
import { RobotLocationHistory } from '../../entities/robotMovement.entity';
import { Point } from 'geojson';

define(Robot, () => {
  const robot = new Robot();
  robot.name = minifaker.word();
  robot.availability = true;
  return robot;
});

define(RobotLocationHistory, () => {
  const location: Point = {
    type: 'Point',
    coordinates: [Number(minifaker.latidude()), Number(minifaker.longitude())],
  };
  const history = new RobotLocationHistory();
  history.location = location;
  history.robot = factory(Robot)() as any;
  return history;
});
