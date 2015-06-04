require_relative './lib/gem_codebreaker_rack'

use Rack::Static, :urls => ["/public"]
use Rack::Session::Cookie, :key => 'rack.session',
    :secret => '123456'

run GemCodebreakerRack::GameInterface.new