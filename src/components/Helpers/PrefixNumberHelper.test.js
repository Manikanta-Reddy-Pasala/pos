const { getPrefixStatsBasedonInvoice } = require('./GstrOnlineHelper');

describe('getPrefixStatsBasedonInvoice', () => {
  it('should group by prefix and calculate lowest, highest, and missing sequence numbers', async () => {
    const data = [
      {
        prefix: 'A',
        sequenceNumber: '12-01/001',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'A',
        sequenceNumber: '12-01/002',
        isCancelled: true,
        einvoiceBillStatus: 'Cancelled'
      },
      {
        prefix: 'A',
        sequenceNumber: '12-01/004',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'B',
        sequenceNumber: '13-02/001',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'B',
        sequenceNumber: '13-02/003',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      }
    ];

    const result = await getPrefixStatsBasedonInvoice(data);

    const expected = new Map([
      [
        'A',
        {
          lowest: 1,
          highest: 4,
          datePrefix: '12-01',
          sequenceNumbers: [1, 2, 4],
          cancelNumber: 1,
          prefix: 'A',
          missingNumbers: [3]
        }
      ],
      [
        'B',
        {
          lowest: 1,
          highest: 3,
          datePrefix: '13-02',
          sequenceNumbers: [1, 3],
          cancelNumber: 0,
          prefix: 'B',
          missingNumbers: [2]
        }
      ]
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle data with no cancellations', async () => {
    const data = [
      {
        prefix: 'C',
        sequenceNumber: '14-03/001',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'C',
        sequenceNumber: '14-03/002',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      }
    ];

    const result = await getPrefixStatsBasedonInvoice(data);

    const expected = new Map([
      [
        'C',
        {
          lowest: 1,
          highest: 2,
          datePrefix: '14-03',
          sequenceNumbers: [1, 2],
          cancelNumber: 0,
          prefix: 'C',
          missingNumbers: []
        }
      ]
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle data with multiple prefixes and datePrefixes', async () => {
    const data = [
      {
        prefix: 'D',
        sequenceNumber: '15-04/001',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'E',
        sequenceNumber: '16-05/001',
        isCancelled: true,
        einvoiceBillStatus: 'Cancelled'
      },
      {
        prefix: null,
        sequenceNumber: '17-06/002',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      }
    ];

    const result = await getPrefixStatsBasedonInvoice(data);

    const expected = new Map([
      [
        'D',
        {
          lowest: 1,
          highest: 1,
          datePrefix: '15-04',
          sequenceNumbers: [1],
          cancelNumber: 0,
          prefix: 'D',
          missingNumbers: []
        }
      ],
      [
        'E',
        {
          lowest: 1,
          highest: 1,
          datePrefix: '16-05',
          sequenceNumbers: [1],
          cancelNumber: 1,
          prefix: 'E',
          missingNumbers: []
        }
      ],
      [
        '17-06',
        {
          lowest: 2,
          highest: 2,
          datePrefix: '17-06',
          sequenceNumbers: [2],
          cancelNumber: 0,
          prefix: null,
          missingNumbers: []
        }
      ]
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle integer sequenceNumbers', async () => {
    const data = [
      {
        prefix: 'F',
        sequenceNumber: 1,
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'F',
        sequenceNumber: 3,
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'F',
        sequenceNumber: 4,
        isCancelled: true,
        einvoiceBillStatus: 'Cancelled'
      },
      {
        prefix: 'G',
        sequenceNumber: 2,
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'G',
        sequenceNumber: 5,
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      }
    ];

    const result = await getPrefixStatsBasedonInvoice(data);

    const expected = new Map([
      [
        'F',
        {
          lowest: 1,
          highest: 4,
          datePrefix: undefined,
          sequenceNumbers: [1, 3, 4],
          cancelNumber: 1,
          prefix: 'F',
          missingNumbers: [2]
        }
      ],
      [
        'G',
        {
          lowest: 2,
          highest: 5,
          datePrefix: undefined,
          sequenceNumbers: [2, 5],
          cancelNumber: 0,
          prefix: 'G',
          missingNumbers: [3, 4]
        }
      ]
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle mixed sequenceNumbers with strings and integers', async () => {
    const data = [
      {
        prefix: 'H',
        sequenceNumber: '18-07/001',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'H',
        sequenceNumber: '18-07/002',
        isCancelled: true,
        einvoiceBillStatus: 'Cancelled'
      },
      {
        prefix: 'H',
        sequenceNumber: 3,
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'I',
        sequenceNumber: '19-08/004',
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      },
      {
        prefix: 'I',
        sequenceNumber: 5,
        isCancelled: false,
        einvoiceBillStatus: 'Completed'
      }
    ];

    const result = await getPrefixStatsBasedonInvoice(data);

    const expected = new Map([
      [
        'H',
        {
          lowest: 1,
          highest: 3,
          datePrefix: '18-07',
          sequenceNumbers: [1, 2, 3],
          cancelNumber: 1,
          prefix: 'H',
          missingNumbers: []
        }
      ],
      [
        'I',
        {
          lowest: 4,
          highest: 5,
          datePrefix: '19-08',
          sequenceNumbers: [4, 5],
          cancelNumber: 0,
          prefix: 'I',
          missingNumbers: []
        }
      ]
    ]);

    expect(result).toEqual(expected);
  });
});
