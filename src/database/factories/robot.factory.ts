import { Robot } from '../../entities/robot.entity';
import { latidude, longitude, word } from 'minifaker';
import 'minifaker/dist/locales/en';
import { define, factory } from 'typeorm-seeding';
import { RobotLocationHistory } from '../../entities/robotMovement.entity';
import { Point } from 'geojson';
import { get_random } from '../../utils/util';

define(Robot, () => {
  const robot = new Robot();
  robot.name = word();
  robot.availability = get_random([true, false]);
  return robot;
});

define(RobotLocationHistory, () => {
  const location: Point = {
    type: 'Point',
    coordinates: [Number(latidude()), Number(longitude())],
  };
  const history = new RobotLocationHistory();
  history.location = location;
  history.robot = factory(Robot)() as any;
  return history;
});
