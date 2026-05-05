import jenkins.CLI
import jenkins.model.Jenkins

// Harden: disable remote CLI; not needed for our use
Jenkins.instance.getDescriptorByType(CLI.DescriptorImpl.class)?.setEnabled(false)
