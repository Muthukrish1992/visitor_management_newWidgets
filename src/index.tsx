import * as React from "react";
import { registerWidget, registerLink, registerUI, IContextProvider, enableLocalization, registerCustomWidgetTemplate, } from './uxp';
import { TitleBar, FilterPanel, WidgetWrapper } from "uxp/components";
import { IWDDesignModeProps } from "widget-designer/components";
import BundleConfig from '../bundle.json';
import TenantUserCountwidget from "./Components/TenantUserCountwidget";
import TenantUserCountwidgetloggedin from "./Components/TenantUserCountwidgetloggedin";

import './styles.scss';
import MobileUIV2 from "./Components/MobileUIV2";

export interface IWidgetProps {
    uxpContext?: IContextProvider,
    instanceId?: string
    designer?: IWDDesignModeProps,
    uiProps?: any
}

const Visitor_management_newWidgetsWidget: React.FunctionComponent<IWidgetProps> = (props) => {
    return (
        <WidgetWrapper>
            <TitleBar title='Visitor_management_newWidgets'>
                <FilterPanel>
                </FilterPanel>
            </TitleBar>
            <MobileUIV2></MobileUIV2>
            <TenantUserCountwidget></TenantUserCountwidget>
            <TenantUserCountwidgetloggedin></TenantUserCountwidgetloggedin>
        </WidgetWrapper>
    )
};

/**
 * Register as a Widget
 */
registerWidget({
    id: "visitor_management_newWidgets",
    widget: Visitor_management_newWidgetsWidget,
    configs: {
        layout: {
            // w: 12,
            // h: 12,
            // minH: 12,
            // minW: 12
        }
    }
});

registerWidget({
    id: "TenantUserCountwidget",
    widget: TenantUserCountwidget,
    configs: {
      layout: {
        w: 8,
        h: 8,
        minH: 8,
        minW: 5
      }
    },
  });

  registerWidget({
    id: "TenantUserCountwidgetloggedin",
    widget: TenantUserCountwidgetloggedin,
    configs: {
      layout: {
        // w: 12,
        // h: 12,
        // minH: 12,
        // minW: 12
      },
    },
  
  });
registerUI({
    id: "mobile-uiv2",
    component: MobileUIV2,
  });
/**
 * Register as a Sidebar Link
 */
/*
registerLink({
    id: "visitor_management_newWidgets",
    label: "Visitor_management_newWidgets",
    // click: () => alert("Hello"),
    component: Visitor_management_newWidgetsWidget
});
*/

/**
 * Register as a UI
 */

/*
registerUI({
   id:"visitor_management_newWidgets",
   component: Visitor_management_newWidgetsWidget
});
*/


/**
 * Register as a Widget template
 * This will enable this widget to be edited through the designer
 */

/**
registerCustomWidgetTemplate({
    id: "visitor_management_newWidgets", // use all lowercase letters
    name: 'Visitor_management_newWidgets',
    description: 'Tempalte Description',
    template: Visitor_management_newWidgetsWidget,
    moduleId: BundleConfig.id,
    complexity: 'advanced',
    icon: ['fas', 'list'],
    expectedSchema: 'dictionary-array'
});
*/


/**
 * Enable localization
 *
 * This will enable the localization
 *
 * you can use uxpContext.$L() function
 *
 * Ex: Assume you  have a localization message in localization json
 *
 * ```
 * // localization.json
 *
 * {
 *      "uxp.my-widget.title": {
 *          "en": "This is my widget" // english translation,
 *          "ar": "<arabic tranlation >",
 *          ... here goes other translations
 *      }
 * }
 *
 * ```
 *
 *
 * thne in your widget
 *
 * ```
 * // your widget
 *
 * return <WidgetWrapper>
 *      <div class='title'>
 *          {props.uxpContext.$L('uxp.my-widget.title')}
 *      </div>
 *  </WidgetWrapper>
 *
 * ```
 *
 * /// you can have parameters as well
 * // we use `$` mark to identify params
 * // Ex: $name, $location
 *
 * ```
 * // localization.json
 *
 * {
 *      ...
 *      "uxp.my-widget.user-welcom-msg":{
 *          "en": "$userName welcome to my widget"
 *      }
 * }
 * ```
 *
 * in widget
 *
 * ```
 *      ...
 *      <div> {props.uxpContext.$L('uxp.my-widget.user-welcom-msg', {userName: "Jane Doe"})} </div>
 * ```
 *
 *
 */

// enableLocalization()