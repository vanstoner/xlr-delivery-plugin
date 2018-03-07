from collections import namedtuple
from delivery.Marker import Marker
from java.util.concurrent import TimeUnit


class Conflicts(object):
    def __init__(self, release_api):
        self.markers = {}
        self.release_api = release_api

    def add_marker(self, release_id, environment, component, start_date):
        marker = Marker(environment, component, start_date, None, False)
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
        r2 = Range(start=o_marker.start, end=o_marker.stop)
        latest_start = max(r1.start, r2.start)
        earliest_end = min(r1.end, r2.end)
        diff = earliest_end.getTime() - latest_start.getTime()
        overlap = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) + 1
        return overlap > 0

    def check_overlap(self, marker):
        for release_id, markers in self.markers.items():
            for o_marker in markers:
                if marker != o_marker and o_marker.environment == marker.environment and self.date_overlap(marker, o_marker):
                    return release_id

    def analyze_conflicts(self):
        for release_id, markers in self.markers.items():
            for marker in markers:
                causer = self.check_overlap(marker)
                if causer:
                    marker.causers.append(causer)
                    marker.conflict = True

    def has_conflicts(self):
        for release_id, markers in self.markers.items():
            for marker in markers:
                if self.check_overlap(marker):
                    return True
        return False

    def to_dict(self):
        result_dict = []
        for release_id, markers in self.markers.items():
            for marker in markers:
                release = self.release_api.getRelease(release_id)
                release_link = release_id.replace(
                    "/", "-").replace("Applications-", "#/releases/")
                causers = []
                if marker.causers:
                    for causer in marker.causers:
                        causer_release = self.release_api.getRelease(causer)
                        causers.append(causer_release.title)
                result_dict.append({"releaseTitle": release.title, "releaseLink": release_link, "environment": marker.environment,
                                    "component": marker.component, "start": str(marker.start), "stop": str(marker.stop), "conflict": marker.conflict, "causers": ",".join(causers)})
        return result_dict
