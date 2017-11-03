import threading

from com.xebialabs.xlrelease.api.v1.forms import Variable

def synchronized(method):
    """ Work with instance method only !!! """

    def new_method(self, *arg, **kws):
        with self.lock:
            return method(self, *arg, **kws)


    return new_method

class Variables:
    lock = threading.RLock()

    def __init__(self, configuration_api):
        self.configuration_api = configuration_api


    @synchronized
    def create_global_variable(self, key, type):
        variable = Variable(key, None)
        variable.setType(type)
        variable.setRequiresValue(False)
        variable.setShowOnReleaseStart(False)
        return self.configuration_api.addGlobalVariable(variable)