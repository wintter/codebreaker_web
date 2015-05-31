require_relative './intarface'

use Rack::Static, :urls => ["/public"]
=begin
use Rack::Session::Cookie, :key => 'rack.session',
    :secret => 'something secret should be here'
=end

run GameInterface.new