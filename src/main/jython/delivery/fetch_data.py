class Marker(object):
    def __init__(self, environment, component, start, stop, conflict):
        self.environment = environment
        self.component = component
        self.start = start
        self.stop = stop
        self.conflict = conflict

    def matches(self, environment, component):
        return environment == self.environment and component == self.component


class Conflicts(object):
    def __init__(self):
        self.markers = {}

    def add_marker(self, release_id, environment, component, start_date):
        marker = Marker(environment,component,start_date, None, False)
        if release_id in self.markers:
            self.markers[release_id].append(marker)
        else:
            self.markers[release_id] = [marker]


    def add_unmarker(self, release_id, environment, component, end_date):
        if release_id not in self.markers:
            return
        for marker in self.markers[release_id]:
            if marker.matches(environment, component) and marker.stop is None:
                marker.stop = end_date
                return

    def date_overlap(self, marker, o_marker):
        Range = namedtuple('Range', ['start', 'end'])
        r1 = Range(start=marker.start, end=marker.stop)
        r2 = Range(start=o_marker.start, end=o_marker.end)
        latest_start = max(r1.start, r2.start)
        earliest_end = min(r1.end, r2.end)
        overlap = (earliest_end - latest_start).days + 1
        return overlap > 0

    def check_overlap(self, marker):
        for release_id, markers in self.markers.items():
            for o_marker in markers:
                if marker != o_marker and o_marker.environment == marker.environment and self.date_overlap(marker, o_marker):
                    return True


    def analyze_conflicts(self):
        for release_id, markers in self.markers.items():
            for marker in markers:
                if self.check_overlap(marker):
                    marker.conflict = True

    def to_dict(self):
        result_dict = []
        for release_id, markers in self.markers.items():
            for marker in markers:
                result_dict.append({"release": release_id, "environment": marker.environment, "component": marker.component, "start": str(marker.start), "stop": str(marker.stop), "conflict": marker.conflict})
        return result_dict


def process_task(release_id, task, conflicts):
    if task.type in ["xlrelease.ParallelGroup", "xlrelease.SequentialGroup"]:
        process_tasks(release_id, task.tasks, conflicts)
    elif task.type == "xlrelease.CustomScriptTask" and task.pythonScript.type == "delivery.mark":
        conflicts.add_marker(release_id, task.pythonScript.getProperty("environment"),
                             task.pythonScript.getProperty("component"), task.scheduledStartDate)
    elif task.type == "xlrelease.CustomScriptTask" and task.pythonScript.type == "delivery.unmark":
        conflicts.add_unmarker(release_id, task.pythonScript.getProperty("environment"),
                               task.pythonScript.getProperty("component"), task.dueDate)


def process_tasks(release_id, tasks, conflicts):
    [process_task(release_id, t, conflicts) for t in tasks]


def process_release(release, conflicts):
    [process_tasks(release.id, p.tasks, conflicts) for p in release.phases]


def analyse(conflicts):
    releases = releaseApi.getReleases()
    [process_release(release, conflicts) for release in releases]


result_conflicts = Conflicts()
analyse(result_conflicts)
result_conflicts.analyze_conflicts()


response.entity = result_conflicts.to_dict()
