module.exports = {
    uuid : function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function(match) {
                var randomNibble = Math.random() * 16 | 0;
                var nibble = (match == 'y') ?
                    (randomNibble & 0x3 | 0x8) :
                    randomNibble;
                return nibble.toString(16);
            }
        );
    }
};
