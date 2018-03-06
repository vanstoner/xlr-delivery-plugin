

class ConflictsProcessor(object):
    def __init__(self, release_api):
        self.release_api = release_api

    def process_task(self, release_id, task, conflicts):
        if task.type in ["xlrelease.ParallelGroup", "xlrelease.SequentialGroup"]:
            self.process_tasks(release_id, task.tasks, conflicts)
        elif task.type == "xlrelease.CustomScriptTask" and task.pythonScript.type == "delivery.mark":
            conflicts.add_marker(release_id, self.get_property_value(release_id, task.pythonScript.getProperty("environment")),
                                self.get_property_value(release_id, task.pythonScript.getProperty("component")), task.scheduledStartDate if task.scheduledStartDate else task.startDate)
        elif task.type == "xlrelease.CustomScriptTask" and task.pythonScript.type == "delivery.unmark":
            conflicts.add_unmarker(release_id, self.get_property_value(release_id, task.pythonScript.getProperty("environment")),
                                self.get_property_value(release_id, task.pythonScript.getProperty("component")), task.dueDate)

    def get_property_value(self, release_id, orig_value):
        if orig_value.startswith("${"):
            variables = self.release_api.getVariables(release_id)
            for variable in variables:
                if variable.key == orig_value.replace("${", "").replace("}",""):
                    return variable.value
        return orig_value

    def process_tasks(self, release_id, tasks, conflicts):
        [self.process_task(release_id, t, conflicts) for t in tasks]


    def process_release(self, release, conflicts):
        [self.process_tasks(release.id, p.tasks, conflicts) for p in release.phases]


    def analyse(self, conflicts):
        releases = self.release_api.getReleases()
        [self.process_release(release, conflicts) for release in releases]
