import React from 'react';
import { ComponentStory } from '@storybook/react';

import { Alert } from './Alert';
import { Button } from '../Button';

export default {
  title: 'Prompt',
  component: Alert
};

// create a template for button component
const Template: ComponentStory<typeof Alert> = args => <Alert {...args} />;

export const PromptComponent = Template.bind({});

PromptComponent.args = {
  children: (
    <>
      <Alert.Title>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Payment Successfull</h3>
      </Alert.Title>
      <Alert.Description>
        <p className="text-sm text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus et nihil nulla iure voluptatibus libero
          molestiae, quidem dignissimos odit similique, rem, repudiandae accusamus praesentium soluta nam alias
          aspernatur exercitationem assumenda itaque? Recusandae veniam delectus facilis quos totam id corrupti
          accusamus, rerum eos expedita dolorum repudiandae. Dolorem iste quas amet facere.
        </p>
      </Alert.Description>
      <Alert.Footer alignEnd>
        <Button variant="danger">No</Button>
        <Button>Yes</Button>
      </Alert.Footer>
    </>
  )
};
