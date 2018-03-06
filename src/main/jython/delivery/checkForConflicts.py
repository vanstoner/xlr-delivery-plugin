from delivery.Conflicts import Conflicts
from delivery.ConflictsProcessor import ConflictsProcessor

conflicts_processor = ConflictsProcessor(releaseApi)
result_conflicts = Conflicts(releaseApi)
conflicts_processor.analyse(result_conflicts)

conflicts = result_conflicts.has_conflicts()