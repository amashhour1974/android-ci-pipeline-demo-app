# -*- coding: utf-8 -*-

require 'appium_lib'

# support files
SPEC_ROOT = File.expand_path(File.dirname(__FILE__))
Dir[File.expand_path('support/**/*.rb', SPEC_ROOT)].each { |f| require f }

app_path = ENV['APK_PATH'] || File.join(Bundler.root, 'apks', 'app-debug.apk')

raise('please specify apk path by setting ENV["APK_PATH"]')
udid = ENV['UDID'] || raise('please specify device serial by setting ENV["UDID"]')

RSpec.configure do |config|

  config.include ::Screenshot

  config.before(:suite) do

    driver_caps = {
      platformName: :android,
      deviceName: 'Android',
      newCommandTimeout: 9999,
      app: app_path,
      udid: udid
    }

    Appium::Driver.new(caps: driver_caps).start_driver

  end

  config.after(:suite) do
    $driver.driver_quit
  end
end
