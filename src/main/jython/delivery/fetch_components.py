from delivery.Variables import Variables

components_key = "global.components"
global_variables = configurationApi.globalVariables

result = None
found = False
for global_variable in global_variables:
    if global_variable.key == components_key:
        found = True
        result = list(global_variable.value)
        break

if not found:
    vars = Variables(configurationApi)
    result = list(vars.create_global_variable(key=components_key,type="xlrelease.SetStringVariable").value)

response.entity = result