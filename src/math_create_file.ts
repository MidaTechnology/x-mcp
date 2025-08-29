
export type ToolDefinition = {
  name: string;
  description: string;
  title: string;
  handler: (extra?: any) => Promise<any>;
};

export const DEFAULT_TEMPLATES = {
  activity: `package {{PACKAGE}}

import android.os.Bundle
import androidx.activity.viewModels
import com.mgx.mathwallet.ui.activity.setting.safelock.BaseLockActivity
import com.mgx.mathwallet.R
import {{BINDING_IMPORT}}

class {{ACTIVITY_CLASS}} : BaseLockActivity<{{VIEWMODEL_CLASS}}, {{BINDING_CLASS}}>() {
	override fun layoutId(): Int {
		return R.layout.{{LAYOUT_NAME}}
	}

	override fun initView(savedInstanceState: Bundle?) {
		// 使用 ViewBinding：binding 已由基类或 inflate 方法提供
	}
}
`,

  viewmodel: `package {{PACKAGE}}

import me.hgj.jetpackmvvm.ext.viewmodel.BaseViewModel

class {{VIEWMODEL_CLASS}} : BaseViewModel() {
	
}
`,

  layout: `<?xml version="1.0" encoding="utf-8"?>
<layout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    
    <data>
			<variable
				name="viewmodel"
				type="{{PACKAGE}}.{{VIEWMODEL_CLASS}}" />
    </data>

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

    </androidx.constraintlayout.widget.ConstraintLayout>
    
</layout>
`,
};

export function getCreateActivityTool(): ToolDefinition {
  return {
    name: "创建一个新的 Android Activity 组件",
    description:
      "根据指定的包名和组件名称，生成一个包含 Activity、ViewModel 和 XML Layout 的完整代码模板，符合 MathWallet Android 项目的结构和规范。",
    title: "创建 Android 组件、生成配置文件和钱包相关逻辑支持\n\n",
    handler: async (extra?: any) => {
      const pkg = (extra && extra.packageName) || "com.mathwallet.app";
      const comp = (extra && extra.componentName) || "Example";
      const activityClass = `${comp}Activity`;
      const viewModelClass = `${comp}ViewModel`;
      const layoutName = `activity_${comp.toLowerCase()}`;

      const activityPath = `app/src/main/java/${pkg.replace(
        /\./g,
        "/"
      )}/${activityClass}.kt`;
      const viewModelPath = `app/src/main/java/${pkg.replace(
        /\./g,
        "/"
      )}/${viewModelClass}.kt`;
      const layoutPath = `app/src/main/res/layout/${layoutName}.xml`;

      const tpl = DEFAULT_TEMPLATES;

      // Binding class and import, e.g. ActivityTestOneBinding
      const bindingClass = `Activity${comp}Binding`;
      const bindingPackage =
        (extra && extra.bindingPackage) || "com.mgx.mathwallet.databinding";
      const bindingImport = `${bindingPackage}.${bindingClass}`;

      const activityCode = tpl.activity
        .replace(/{{PACKAGE}}/g, pkg)
        .replace(/{{ACTIVITY_CLASS}}/g, activityClass)
        .replace(/{{VIEWMODEL_CLASS}}/g, viewModelClass)
        .replace(/{{LAYOUT_NAME}}/g, layoutName)
        .replace(/{{BINDING_CLASS}}/g, bindingClass)
        .replace(/{{BINDING_IMPORT}}/g, bindingImport);

      const viewModelCode = tpl.viewmodel
        .replace(/{{PACKAGE}}/g, pkg)
        .replace(/{{VIEWMODEL_CLASS}}/g, viewModelClass);

      const layoutCode = tpl.layout
        .replace(/{{LAYOUT_NAME}}/g, layoutName)
        .replace(/{{VIEWMODEL_CLASS}}/g, viewModelClass);

      return {
        content: [
          {
            type: "text",
            text: activityCode,
          },
          {
            type: "text",
            text: viewModelCode,
          },
          {
            type: "text",
            text: layoutCode,
          },
        ],
      };
    },
  };
}
