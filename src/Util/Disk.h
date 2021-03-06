/*
 * Disk.h
 *
 *  Created on: Nov 7, 2014
 *      Author: root
 */

#ifndef SRC_DISK_H_
#define SRC_DISK_H_
#include <unordered_map>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <iostream>
#include <sys/ioctl.h>
#include <linux/hdreg.h>
#include <sys/ioctl.h>
#include <linux/fs.h>
#include <malloc.h>
namespace HDDTest
{

class Disk
{
public:



	static Disk *get(std::string);

	void readPage(uint64_t);
	void readExtent(uint64_t);
	void writePage(uint64_t);
	void writeExtent(uint64_t);
	void del();
	void setPageSize(int);
	void setExtentSize(int);
	std::string getName();

	const std::string& getPath() const {
		return path;
	}

	std::string path;
protected:

	bool isValid();

private:

	uint64_t pageSize;
	uint64_t extentSize;

	int fd;

	char *pageBuffer;
	char *extentBuffer;

	Disk(std::string);
	virtual ~Disk();

	void startup();
	void open(std::string);

	unsigned long blockSize;

	size_t calcBufferSize(size_t);

	static std::unordered_map<std::string, Disk *> disks;
};

} /* namespace DBTest */

#endif /* SRC_DISK_H_ */
