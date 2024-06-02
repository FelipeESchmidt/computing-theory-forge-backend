import { MinifiedTheoreticalMachine, TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';
import { ITheoreticalMachine } from '@/database/models/theoreticalMachine';

import { messages } from './messages';

export interface IReturnedTheoreticalMachine extends TheoreticalMachine {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export const minifyMachine = ({ machine, name }: TheoreticalMachine): MinifiedTheoreticalMachine => {
  try {
    const machineMinified = machine.recorders
      .map(({ name: functionalityName, functionalities }) => `${functionalityName}@${functionalities.join(',')}`)
      .join('|') as MinifiedTheoreticalMachine['machine'];

    return {
      name,
      machine: machineMinified,
    };
  } catch (ex) {
    throw new Error(messages.machineSaveFailed);
  }
};

export const maximizeMachine = ({
  machine,
  name,
  ...otherMachineProps
}: ITheoreticalMachine): IReturnedTheoreticalMachine => {
  try {
    const maximizedRecorders = machine.split('|').map((recorder) => {
      const [name, functionalities] = recorder.split('@');

      return {
        name,
        functionalities: functionalities.split(',').map(Number),
      };
    });

    return {
      ...otherMachineProps,
      name,
      machine: {
        recorders: maximizedRecorders,
      },
    };
  } catch (ex) {
    throw new Error(ex as string);
  }
};
