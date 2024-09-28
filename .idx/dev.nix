{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.docker
  ];
  idx.extensions = [
    "angular.ng-template"
  ];

  services.docker.enable = true;

  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "start"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
          "--disable-host-check"
        ];
        manager = "web";
      };
    };
  };
}