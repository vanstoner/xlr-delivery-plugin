from delivery.Variables import Variables

environments_key = "global.environments"
global_variables = configurationApi.globalVariables

result = None
found = False
for global_variable in global_variables:
    if global_variable.key == environments_key:
        found = True
        result = list(global_variable.value)
        break

if not found:
    vars = Variables(configurationApi)
    result = list(vars.create_global_variable(key=environments_key,type="xlrelease.SetStringVariable").value)

response.entity = result