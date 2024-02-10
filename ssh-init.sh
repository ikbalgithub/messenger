eval `ssh-agent -s`
ssh-add ~/.ssh/iqbal
ssh -t git@github.com
cd ~/Desktop