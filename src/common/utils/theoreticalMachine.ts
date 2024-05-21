import { MinifiedTheoreticalMachine, TheoreticalMachine } from '@/api/theoreticalMachine/theoreticalMachineModel';

import { messages } from './messages';

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

export const maximizeMachine = ({ machine, name }: MinifiedTheoreticalMachine): TheoreticalMachine => {
  try {
    const maximizedRecorders = machine.split('|').map((machine) => {
      const [name, functionalities] = machine.split('@');

      return {
        name,
        functionalities: functionalities.split(',').map(Number),
      };
    });

    return {
      name,
      machine: {
        recorders: maximizedRecorders,
      },
    };
  } catch (ex) {
    throw new Error(ex as string);
  }
};
