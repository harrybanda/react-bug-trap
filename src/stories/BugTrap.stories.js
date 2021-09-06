import { React } from "react";
import { storiesOf } from "@storybook/react";

import { BugTrap } from "../components/BugTrap";

const stories = storiesOf("Feedback Form", module);

stories.add("App", () => {
  return <BugTrap />;
});
