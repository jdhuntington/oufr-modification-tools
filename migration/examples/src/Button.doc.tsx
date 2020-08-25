import { IDocPageProps } from "../../../../common/DocPage.types";

const ButtonActionExampleCode = require("!raw-loader!office-ui-fabric-react/src/components/Button/examples/Button.Action.Example.tsx") as string;
const ButtonAnchorExampleCode = require("!raw-loader!office-ui-fabric-react/src/components/Button/examples/Button.Anchor.Example.tsx") as string;
const ButtonSplitExampleCode = require("!raw-loader!office-ui-fabric-react/src/components/Button/examples/Button.Split.Example.tsx") as string;
const ButtonToggleExampleCode = require("!raw-loader!office-ui-fabric-react/src/components/Button/examples/Button.Toggle.Example.tsx") as string;
const ButtonCommandExampleCode = require("!raw-loader!office-ui-fabric-react/src/components/Button/examples/Button.Command.Example.tsx") as string;

export const ButtonPageProps = (props: IButtonDocPageProps): IDocPageProps => ({
  dos: require<
    string
  >("!raw-loader!office-ui-fabric-react/src/components/Button/docs/ButtonDos.md"),
  donts: require<
    string
  >("!raw-loader!office-ui-fabric-react/src/components/Button/docs/ButtonDonts.md"),
  isHeaderVisible: true,
  isFeedbackVisible: true
});
