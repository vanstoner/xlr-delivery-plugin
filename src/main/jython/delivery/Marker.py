class Marker(object):
    def __init__(self, environment, component, start, stop, conflict):
        self.environment = environment
        self.component = component
        self.start = start
        self.stop = stop
        self.conflict = conflict

    def matches(self, environment, component):
        return environment == self.environment and component == self.component
